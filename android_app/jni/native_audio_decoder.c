#include <jni.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <android/log.h>

#include <libavformat/avformat.h>
#include <libavformat/avio.h>
#include <libavcodec/avcodec.h>
#include <libswresample/swresample.h>
#include <libavutil/opt.h>
#include <libavutil/channel_layout.h>

#define LOG_TAG "NativeAudioDecoder"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

typedef struct {
    int fd;
    uint8_t *avio_buf;
    AVIOContext *avio_ctx;
    AVFormatContext *fmt_ctx;
    AVCodecContext *codec_ctx;
    SwrContext *swr_ctx;
    int audio_stream_idx;
    AVPacket *pkt;
    AVFrame *frame;
    int out_sample_rate;
    int out_channels;
} NativeDecoder;

static int read_packet_cb(void *opaque, uint8_t *buf, int buf_size) {
    NativeDecoder *dec = (NativeDecoder *)opaque;
    if (!dec || dec->fd < 0) return AVERROR_EOF;
    ssize_t ret = read(dec->fd, buf, buf_size);
    if (ret < 0) return AVERROR(errno);
    if (ret == 0) return AVERROR_EOF;
    return (int)ret;
}

static int64_t seek_packet_cb(void *opaque, int64_t offset, int whence) {
    NativeDecoder *dec = (NativeDecoder *)opaque;
    if (!dec || dec->fd < 0) return -1;

    if (whence == AVSEEK_SIZE) {
        struct stat st;
        if (fstat(dec->fd, &st) == 0) {
            return st.st_size;
        }
        return -1;
    }

    off_t ret = lseek(dec->fd, (off_t)offset, whence);
    if (ret == (off_t)-1) return -1;
    return (int64_t)ret;
}

JNIEXPORT jlong JNICALL
Java_com_aakashstream_app_MainActivity_00024NativeHardwareAudioDecoder_nativeOpenFd(
        JNIEnv *env, jobject thiz, jint raw_fd) {
    if (raw_fd < 0) return 0;
    int fd = dup(raw_fd);
    if (fd < 0) return 0;

    NativeDecoder *dec = (NativeDecoder *)calloc(1, sizeof(NativeDecoder));
    if (!dec) {
        close(fd);
        return 0;
    }
    dec->fd = fd;

    dec->avio_buf = (uint8_t *)av_malloc(65536);
    if (!dec->avio_buf) {
        close(fd);
        free(dec);
        return 0;
    }

    dec->avio_ctx = avio_alloc_context(
            dec->avio_buf, 65536, 0, dec, read_packet_cb, NULL, seek_packet_cb
    );

    if (!dec->avio_ctx) {
        av_free(dec->avio_buf);
        close(fd);
        free(dec);
        return 0;
    }

    dec->fmt_ctx = avformat_alloc_context();
    dec->fmt_ctx->pb = dec->avio_ctx;
    dec->fmt_ctx->flags |= AVFMT_FLAG_FAST_SEEK | AVFMT_FLAG_NOBUFFER;
    dec->fmt_ctx->probesize = 256 * 1024;
    dec->fmt_ctx->max_analyze_duration = 500000;

    if (avformat_open_input(&dec->fmt_ctx, NULL, NULL, NULL) < 0) {
        LOGE("Failed to open AVIO input from FD: %d", fd);
        avio_context_free(&dec->avio_ctx);
        avformat_free_context(dec->fmt_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    if (avformat_find_stream_info(dec->fmt_ctx, NULL) < 0) {
        LOGE("Failed to find stream info from FD: %d", fd);
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    dec->audio_stream_idx = -1;
    for (unsigned int i = 0; i < dec->fmt_ctx->nb_streams; i++) {
        if (dec->fmt_ctx->streams[i]->codecpar->codec_type == AVMEDIA_TYPE_AUDIO) {
            AVDictionaryEntry *lang = av_dict_get(dec->fmt_ctx->streams[i]->metadata, "language", NULL, 0);
            if (dec->audio_stream_idx < 0 || (lang && (strcasecmp(lang->value, "hin") == 0 || strcasecmp(lang->value, "hi") == 0 || strcasecmp(lang->value, "hindi") == 0))) {
                dec->audio_stream_idx = (int)i;
                if (lang && (strcasecmp(lang->value, "hin") == 0 || strcasecmp(lang->value, "hi") == 0)) {
                    break;
                }
            }
        }
    }

    if (dec->audio_stream_idx < 0) {
        LOGE("No audio stream found in FD: %d", fd);
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    AVCodecParameters *codecpar = dec->fmt_ctx->streams[dec->audio_stream_idx]->codecpar;
    const AVCodec *codec = avcodec_find_decoder(codecpar->codec_id);
    if (!codec) {
        LOGE("Decoder not found for codec ID: %d", codecpar->codec_id);
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    dec->codec_ctx = avcodec_alloc_context3(codec);
    if (!dec->codec_ctx) {
        LOGE("Failed to allocate codec context");
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    if (avcodec_parameters_to_context(dec->codec_ctx, codecpar) < 0) {
        LOGE("Failed to copy codec parameters to context");
        avcodec_free_context(&dec->codec_ctx);
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    if (avcodec_open2(dec->codec_ctx, codec, NULL) < 0) {
        LOGE("Failed to open codec: %s", codec->name);
        avcodec_free_context(&dec->codec_ctx);
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    dec->out_sample_rate = dec->codec_ctx->sample_rate > 0 ? dec->codec_ctx->sample_rate : 48000;
    dec->out_channels = 2;

    AVChannelLayout out_ch_layout = AV_CHANNEL_LAYOUT_STEREO;
    swr_alloc_set_opts2(
            &dec->swr_ctx,
            &out_ch_layout,
            AV_SAMPLE_FMT_S16,
            dec->out_sample_rate,
            &dec->codec_ctx->ch_layout,
            dec->codec_ctx->sample_fmt,
            dec->codec_ctx->sample_rate,
            0,
            NULL
    );

    if (!dec->swr_ctx || swr_init(dec->swr_ctx) < 0) {
        LOGE("Failed to initialize SwrContext");
        if (dec->swr_ctx) swr_free(&dec->swr_ctx);
        avcodec_free_context(&dec->codec_ctx);
        avformat_close_input(&dec->fmt_ctx);
        avio_context_free(&dec->avio_ctx);
        close(fd);
        free(dec);
        return 0;
    }

    dec->pkt = av_packet_alloc();
    dec->frame = av_frame_alloc();

    LOGI("Native Audio Decoder initialized for FD %d (Codec: %s, Rate: %d Hz, Stream: %d)",
         fd, codec->name, dec->out_sample_rate, dec->audio_stream_idx);

    return (jlong)(intptr_t)dec;
}

JNIEXPORT jint JNICALL
Java_com_aakashstream_app_MainActivity_00024NativeHardwareAudioDecoder_nativeGetSampleRate(
        JNIEnv *env, jobject thiz, jlong handle) {
    NativeDecoder *dec = (NativeDecoder *)(intptr_t)handle;
    if (!dec) return 48000;
    return dec->out_sample_rate;
}

JNIEXPORT jint JNICALL
Java_com_aakashstream_app_MainActivity_00024NativeHardwareAudioDecoder_nativeReadPcm(
        JNIEnv *env, jobject thiz, jlong handle, jbyteArray buffer_jarr) {
    NativeDecoder *dec = (NativeDecoder *)(intptr_t)handle;
    if (!dec || !dec->codec_ctx || !dec->fmt_ctx || !dec->swr_ctx) return -1;

    jsize buf_len = (*env)->GetArrayLength(env, buffer_jarr);
    jbyte *buf = (*env)->GetByteArrayElements(env, buffer_jarr, NULL);
    if (!buf) return -1;

    int total_bytes = 0;
    uint8_t *out_ptr = (uint8_t *)buf;

    while (total_bytes < buf_len) {
        int ret = avcodec_receive_frame(dec->codec_ctx, dec->frame);
        if (ret == 0) {
            int max_dst_samples = (buf_len - total_bytes) / (2 * sizeof(int16_t));
            if (max_dst_samples <= 0) {
                av_frame_unref(dec->frame);
                break;
            }

            uint8_t *dst_data[1] = { out_ptr };
            int converted_samples = swr_convert(
                    dec->swr_ctx,
                    dst_data,
                    max_dst_samples,
                    (const uint8_t **)dec->frame->extended_data,
                    dec->frame->nb_samples
            );

            if (converted_samples > 0) {
                int bytes_produced = converted_samples * 2 * sizeof(int16_t);
                total_bytes += bytes_produced;
                out_ptr += bytes_produced;
            }

            av_frame_unref(dec->frame);
            if (total_bytes >= buf_len) {
                break;
            }
            continue;
        }

        if (ret == AVERROR(EAGAIN) || ret == 0) {
            int read_ret = av_read_frame(dec->fmt_ctx, dec->pkt);
            if (read_ret < 0) {
                break;
            }

            if (dec->pkt->stream_index == dec->audio_stream_idx) {
                avcodec_send_packet(dec->codec_ctx, dec->pkt);
            }
            av_packet_unref(dec->pkt);
        } else {
            break;
        }
    }

    (*env)->ReleaseByteArrayElements(env, buffer_jarr, buf, 0);
    return total_bytes;
}

JNIEXPORT void JNICALL
Java_com_aakashstream_app_MainActivity_00024NativeHardwareAudioDecoder_nativeSeek(
        JNIEnv *env, jobject thiz, jlong handle, jdouble seconds) {
    NativeDecoder *dec = (NativeDecoder *)(intptr_t)handle;
    if (!dec || !dec->fmt_ctx || !dec->codec_ctx) return;

    AVStream *stream = dec->fmt_ctx->streams[dec->audio_stream_idx];
    int64_t target_ts = (int64_t)(seconds / av_q2d(stream->time_base));
    av_seek_frame(dec->fmt_ctx, dec->audio_stream_idx, target_ts, AVSEEK_FLAG_BACKWARD);
    avcodec_flush_buffers(dec->codec_ctx);
}

JNIEXPORT void JNICALL
Java_com_aakashstream_app_MainActivity_00024NativeHardwareAudioDecoder_nativeClose(
        JNIEnv *env, jobject thiz, jlong handle) {
    NativeDecoder *dec = (NativeDecoder *)(intptr_t)handle;
    if (!dec) return;

    if (dec->swr_ctx) swr_free(&dec->swr_ctx);
    if (dec->frame) av_frame_free(&dec->frame);
    if (dec->pkt) av_packet_free(&dec->pkt);
    if (dec->codec_ctx) avcodec_free_context(&dec->codec_ctx);
    if (dec->fmt_ctx) avformat_close_input(&dec->fmt_ctx);
    if (dec->avio_ctx) avio_context_free(&dec->avio_ctx);
    if (dec->fd >= 0) close(dec->fd);
    free(dec);
    LOGI("Native Audio Decoder closed successfully.");
}
