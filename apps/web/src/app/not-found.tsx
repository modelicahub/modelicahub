"use client";

import { RgbyText } from "@modelicahub/ui/rgby-text";
import { Box, PageLayout } from "@primer/react";
import { Blankslate } from "@primer/react/drafts";
import { BookIcon } from "@primer/styled-octicons";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Blankslate>
      <Blankslate.Visual>
        <Box sx={{ textAlign: "center", mt: 10, mb: 3 }}>
          <RgbyText size="min(7vw, 72px)" value="404"></RgbyText>
        </Box>
      </Blankslate.Visual>
    </Blankslate>
  );
}
