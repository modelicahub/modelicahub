import fs from "node:fs";
import readline from "node:readline";
import toHex from "to-hex";

export async function countLines(filename: string): Promise<number> {
  let c = 0;
  const readStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: readStream,
  });
  for await (const line of rl) c += 1;
  rl.close();
  readStream.destroy();
  return c;
}

export function int10StrToUint8Array(
  int10Str?: string,
): Uint8Array | undefined {
  if (int10Str == undefined) return undefined;
  return Uint8Array.from(Buffer.from(toHex(int10Str), "hex"));
}
