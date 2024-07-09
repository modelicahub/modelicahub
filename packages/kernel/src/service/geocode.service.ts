import { Repository } from "typeorm";
import { Kernel } from "../kernel.js";
import {
  GeocodeIPEntity,
  GeocodeIPv4Entity,
  GeocodeIPv6Entity,
} from "../entity/geocode.entity.js";
import { parse } from "csv-parse";
import fs from "node:fs";
import { finished } from "node:stream/promises";
import ProgressBar from "progress";
import { countLines, int10StrToUint8Array } from "../util.js";
import path from "node:path";

export class GeocodeService {
  geocodeIPv4Repository: Repository<GeocodeIPv4Entity>;
  geocodeIPv6Repository: Repository<GeocodeIPv6Entity>;

  constructor(private readonly kernel: Kernel) {
    this.geocodeIPv4Repository =
      this.kernel.dataSource.getRepository(GeocodeIPv4Entity);
    this.geocodeIPv6Repository =
      this.kernel.dataSource.getRepository(GeocodeIPv6Entity);
  }

  private async loadGeolocationData(
    filePath: string,
    entityClass: new (data?: {
      countryCode?: string;
      ipRangeEnd?: Uint8Array;
      ipRangeStart?: Uint8Array;
    }) => GeocodeIPEntity,
  ) {
    const name = path.basename(filePath);
    const progressBar = new ProgressBar(
      `  loading ${name} [:bar] :rate inserts/sec :percent :etas`,
      {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: await countLines(filePath.substring(6)),
      },
    );
    const parser = fs.createReadStream(filePath.substring(6)).pipe(parse());
    parser.on("readable", async () => {
      await this.kernel.dataSource.transaction(async (entityManager) => {
        const repository = entityManager.getRepository(entityClass);
        let record;
        while ((record = parser.read()) !== null) {
          repository.upsert(
            [
              new entityClass({
                countryCode: record[2],
                ipRangeEnd: int10StrToUint8Array(record[1]),
                ipRangeStart: int10StrToUint8Array(record[0]),
              }),
            ],
            ["ipRangeEnd", "ipRangeStart"],
          );
          progressBar.tick(1);
        }
      });
    });
    await finished(parser);
    parser.destroy();
  }

  async initialize(): Promise<void> {
    await this.loadGeolocationData(
      import.meta.resolve(
        "@ip-location-db/geo-whois-asn-country/geo-whois-asn-country-ipv4-num.csv",
      ),
      GeocodeIPv4Entity,
    );
    //await this.loadGeolocationData(
    //require.resolve('@ip-location-db/geo-whois-asn-country/geo-whois-asn-country-ipv6-num.csv'),
    //GeocodeIPv4Entity);
  }

  async geocodeIP(ip?: Uint8Array): Promise<string | undefined> {
    if (ip == undefined) return undefined;
    if (ip.byteLength <= 4) return this.geocodeIPv4(ip);
    else return this.geocodeIPv6(ip);
  }

  async geocodeIPv4(ipv4: Uint8Array): Promise<string | undefined> {
    return (
      (
        await this.geocodeIPv4Repository
          .createQueryBuilder("geocode")
          .where("geocode.ipRangeEnd >= :ipv4", { ipv4 })
          .andWhere("geocode.ipRangeStart <= :ipv4 ", { ipv4 })
          .getOne()
      )?.countryCode ?? undefined
    );
  }

  async geocodeIPv6(ipv6: Uint8Array): Promise<string | undefined> {
    return (
      (
        await this.geocodeIPv6Repository
          .createQueryBuilder("geocode")
          .where("geocode.ipRangeEnd >= :ipv6", { ipv6 })
          .andWhere("geocode.ipRangeStart <= :ipv6 ", { ipv6 })
          .getOne()
      )?.countryCode ?? undefined
    );
  }
}
