"""
T2L Authorized Public Media Discovery & Validation Pipeline.
"""

from .source_registry import SourceRegistry
from .license_checker import LicenseChecker, LicenseCheckResult
from .index_discovery import IndexDiscovery, DiscoveredCandidate
from .content_classifier import ContentClassifier, ContentClassificationResult
from .metadata_matcher import MetadataMatcher, NormalizedIdentity
from .media_probe import MediaProber, DiscoveryProbeResult
from .import_pipeline import ImportPipeline, DuplicateCheckResult, ThumbnailValidationResult

__all__ = [
    "SourceRegistry",
    "LicenseChecker",
    "LicenseCheckResult",
    "IndexDiscovery",
    "DiscoveredCandidate",
    "ContentClassifier",
    "ContentClassificationResult",
    "MetadataMatcher",
    "NormalizedIdentity",
    "MediaProber",
    "DiscoveryProbeResult",
    "ImportPipeline",
    "DuplicateCheckResult",
    "ThumbnailValidationResult"
]
