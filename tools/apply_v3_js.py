APP_JS_PATHS = ['assets/app.js', 'android_app/src/main/assets/assets/app.js']

OOKLA_HELPER = """
// ==============================================================================
// REFINEMENTS V3: OOKLA-STYLE SPEEDOMETER ANIMATION HELPER
// ==============================================================================
function updateOoklaGauge(speed) {
  const maxSpeed = 100.0;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speed));
  const ratio = clampedSpeed / maxSpeed;
  
  // Angle: -120deg (at 0) to +120deg (at 100+ Mbps)
  const angle = -120 + (ratio * 240);
  
  // Arc dashoffset: 400 (empty) to 0 (full)
  const offset = 400 - (ratio * 400);

  const needle = document.getElementById('ooklaNeedleGroup');
  const arc = document.getElementById('ooklaProgressArc');
  const digits = document.getElementById('speedMeterVal');

  if (needle) needle.setAttribute('transform', `translate(140, 148) rotate(${angle.toFixed(1)})`);
  if (arc) arc.style.strokeDashoffset = offset.toFixed(1);
  if (digits) digits.textContent = speed.toFixed(1);
}
window.updateOoklaGauge = updateOoklaGauge;
"""

for p in APP_JS_PATHS:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Append helper
    content += "\n" + OOKLA_HELPER

    # In openSpeedTestModal, initialize gauge to 0
    content = content.replace(
        """window.openSpeedTestModal = function() {
  const modal = document.getElementById('speedTestModal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  runLiveSpeedTest(false);
};""",
        """window.openSpeedTestModal = function() {
  const modal = document.getElementById('speedTestModal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  if (typeof updateOoklaGauge === 'function') updateOoklaGauge(0);
  runLiveSpeedTest(false);
};"""
    )

    # In runLiveSpeedTest, update updateOoklaGauge during tick and finish
    old_tick_loop = """      // Smooth Gauge Animation
      let currentTick = 1.0;
      const step = speedMbps / 15;
      const interval = setInterval(() => {
        currentTick += step;
        if (currentTick >= speedMbps) {
          currentTick = speedMbps;
          clearInterval(interval);
          finishTest(speedMbps, measuredPing);
        }
        if (meterVal) meterVal.textContent = currentTick.toFixed(1);
      }, 35);"""

    new_tick_loop = """      // Smooth Ookla Gauge Animation
      let currentTick = 1.0;
      const step = speedMbps / 18;
      const interval = setInterval(() => {
        currentTick += step;
        if (currentTick >= speedMbps) {
          currentTick = speedMbps;
          clearInterval(interval);
          finishTest(speedMbps, measuredPing);
        }
        updateOoklaGauge(currentTick);
      }, 30);"""

    content = content.replace(old_tick_loop, new_tick_loop)

    old_finish_meter = """  function finishTest(finalSpeed, ping) {
    if (meterVal) meterVal.textContent = finalSpeed.toFixed(1);"""

    new_finish_meter = """  function finishTest(finalSpeed, ping) {
    updateOoklaGauge(finalSpeed);"""

    content = content.replace(old_finish_meter, new_finish_meter)

    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {p} with Ookla gauge animation.")

