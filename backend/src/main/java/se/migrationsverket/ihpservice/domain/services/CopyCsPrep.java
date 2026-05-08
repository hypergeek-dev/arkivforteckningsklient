package se.migrationsverket.ihpservice.domain.services;

import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;

public record CopyCsPrep(String originalPath, ClassificationStructureTypeNode original, ClassificationStructureTypeNode copy) {
}
