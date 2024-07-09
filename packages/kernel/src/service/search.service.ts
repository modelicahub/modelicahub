import { Repository } from "typeorm";
import { Kernel } from "../kernel.js";
import { ArchiveReleaseEntity } from "../entity/archive.entity.js";
import { SearchResult } from "../type/search-result.js";

export class SearchService {
  private readonly archiveReleaseRepository: Repository<ArchiveReleaseEntity>;

  constructor(private kernel: Kernel) {
    this.archiveReleaseRepository =
      this.kernel.dataSource.getRepository(ArchiveReleaseEntity);
  }

  async search(input: { q: string }): Promise<SearchResult> {
    return await this.archiveReleaseRepository
      .createQueryBuilder("release")
      .select(["archive.name as title", "release.description as description"])
      .innerJoin("release.archive", "archive")
      .where("archive.name LIKE '%' || :name || '%'", { name: input.q })
      .execute();
  }
}
