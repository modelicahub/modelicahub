import { buildSchema, GraphQLSchema } from "graphql";
import { Kernel } from "./kernel.js";
import { SearchResult } from "./type/search-result.js";

export function schema(): GraphQLSchema {
  return buildSchema(`#graphql
    type Archive {
      metrics: ArchiveMetrics!
      name: String!
      releases: [ArchiveRelease!]!
    }
  
    type ArchiveDependency {
      name: String!
      release: ArchiveRelease
      version: String!
    }
  
    type ArchiveDistribution {
      fileCount: Float!
      tarball: String!
      unpackedSize: Float!
    }
  
    type ArchiveMetrics {
      lifetimeDownloads: Float!
      lifetimeViews: Float!
      timestamp: Float!
      weeklyDownloads: [Float!]!
      weeklyViews: [Float!]!
    }
  
    type ArchiveRelease {
      archive: Archive!
      dependencies: [ArchiveDependency!]!
      dependents: [ArchiveRelease!]!
      description: String!
      distribution: ArchiveDistribution!
      license: String!
      metrics: ArchiveMetrics!
      previousReleases: [ArchiveRelease!]!
      releaseTimestamp: Float!
      repositoryUrl: String
      version: SemanticVersion!
    }
  
    type SemanticVersion {
      buildLabel: String
      major: Float!
      minor: Float!
      patch: Float!
      preReleaseLabel: String
      string: String!
    }
    
    type SearchResult {
      description: String!
      title: String!
    }

    type Query {
      archive(name: String!): Archive
      archiveRelease(name: String!, version: String!): ArchiveRelease
      search(q: String!): [SearchResult!]!
    }
  `);
}

export function api(kernel: Kernel) {
  return {
    async search(input: { q: string }): Promise<SearchResult> {
      return kernel.search.search(input);
    },
  };
}
