# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Added

## [1.2.0] - 2024-02-29

### Added

- Subfolder for CACAO Playbook examples.
- Support for importing CACAO Playbooks as text in both JSON and base64 encoded formats.
- Support for the missing HTTP headers property. Used in e.g. OpenC2 and HTTP-API commands.
- Exporting the CACAO playbooks as STIX 2.1 Course of Action object with the Playbook extension.

### Changed

- Adjusted the CSS so that the expandable lists and dictionaries don't cover other properties in the view.
- Changed the input for 'related to' property in playbook metadata from list dropdown to string.

### Removed

- The unevaluatedProperties:false from the CACAO JSON validation schemas.

### Fixed

- Storing and retrieving of Caldera-cmd commands.

## [1.1.0] - 2024-02-15

### Removed

- Removed sample keys for signing and verifying playbooks.

## [1.0.0] - 2024-01-17

### Added

- Version 1.0.0 of the CACAO Roaster.
