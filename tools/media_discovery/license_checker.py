#!/usr/bin/env python3
"""
T2L License & Rights Verification Engine.
Evaluates Public Domain, Creative Commons, and Open Archival license status.
Rejects unauthorized, commercial-only, or ambiguous rights claims.
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional, Tuple


@dataclass
class LicenseCheckResult:
    is_valid: bool
    license_type: str  # PUBLIC_DOMAIN, CREATIVE_COMMONS, OPEN_ARCHIVAL, RESTRICTED, UNKNOWN
    license_details: str
    rejection_reason: Optional[str] = None


class LicenseChecker:
    PUBLIC_DOMAIN_KEYWORDS = [
        "public domain", "publicdomain", "cc0", "pdm", "pre-1929", "pre-1978",
        "copyright not renewed", "open access", "no copyright"
    ]
    
    CREATIVE_COMMONS_KEYWORDS = [
        "creativecommons.org/licenses", "by-sa", "by-nc", "by-nd", "by/4.0", "by/3.0", "by/2.0"
    ]
    
    RESTRICTED_KEYWORDS = [
        "all rights reserved", "unauthorized", "strictly prohibited", "commercial only",
        "copyrighted work", "dmca"
    ]

    def verify_license(self, metadata: Dict[str, Any], release_year: Optional[int] = None) -> LicenseCheckResult:
        """
        Evaluates the metadata of a candidate item to determine if it has legitimate
        public domain, Creative Commons, or authorized archival distribution rights.
        """
        # 1. Combine all license-relevant fields into a text blob for inspection
        fields = [
            str(metadata.get("licenseurl", "")),
            str(metadata.get("rights", "")),
            str(metadata.get("copyright", "")),
            str(metadata.get("license", "")),
            str(metadata.get("notes", "")),
            str(metadata.get("description", "")),
            str(metadata.get("collection", ""))
        ]
        combined = " ".join(fields).lower()

        # 2. Check explicitly restricted terms
        for rk in self.RESTRICTED_KEYWORDS:
            if rk in combined and "not " + rk not in combined and "no " + rk not in combined:
                return LicenseCheckResult(
                    is_valid=False,
                    license_type="RESTRICTED",
                    license_details=f"Contains restricted rights claim: {rk}",
                    rejection_reason=f"Media rights explicitly marked as restricted ({rk})"
                )

        # 3. Check Creative Commons
        for ck in self.CREATIVE_COMMONS_KEYWORDS:
            if ck in combined:
                return LicenseCheckResult(
                    is_valid=True,
                    license_type="CREATIVE_COMMONS",
                    license_details="Creative Commons Open License"
                )

        # 4. Check Public Domain keywords
        for pk in self.PUBLIC_DOMAIN_KEYWORDS:
            if pk in combined:
                return LicenseCheckResult(
                    is_valid=True,
                    license_type="PUBLIC_DOMAIN",
                    license_details="Public Domain / Copyright Expired or Waived"
                )

        # 5. Check statutory Public Domain by Release Year (< 1929)
        year = release_year or metadata.get("year")
        try:
            if year:
                y_int = int(str(year).strip()[:4])
                if y_int < 1929 and y_int > 1880:
                    return LicenseCheckResult(
                        is_valid=True,
                        license_type="PUBLIC_DOMAIN",
                        license_details=f"Public Domain by Statutory Expiration (Released {y_int} < 1929)"
                    )
        except Exception:
            pass

        # 6. Check if part of verified public collections
        collection = str(metadata.get("collection", "")).lower()
        if "feature_films" in collection or "prelinger" in collection or "silent_films" in collection:
            return LicenseCheckResult(
                is_valid=True,
                license_type="OPEN_ARCHIVAL",
                license_details=f"Authorized Historic Public Film Archive ({collection})"
            )

        # If licensing cannot be determined, zero-trust rule: DO NOT IMPORT IT
        return LicenseCheckResult(
            is_valid=False,
            license_type="UNKNOWN",
            license_details="Could not establish public domain, Creative Commons, or open license permission",
            rejection_reason="No verifiable open license or public domain evidence found in item metadata"
        )
