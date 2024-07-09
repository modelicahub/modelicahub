"use client";

import { RgbyText } from "@modelicahub/ui/rgby-text";
import { Box, IconButton, PageLayout, TextInput } from "@primer/react";
import { SearchIcon } from "@primer/styled-octicons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? undefined);
  const onKeyDown = (e: any) => {
    if (e.key !== "Enter") return;
    router.push(`/search?q=${value}`, {
      scroll: true,
    });
  };
  const onClick = (e: any) => {
    router.push(`/search?q=${value}`, {
      scroll: true,
    });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          fontFamily: '"Noto Naskh Arabic", serif',
        }}
      >
        ﷽
      </Box>
      <Box sx={{ flex: 1 }}>
        <PageLayout>
          <PageLayout.Content width="medium">
            <Box sx={{ textAlign: "center", mt: 10, mb: 3 }}>
              <RgbyText
                size="min(7vw, 72px)"
                value="Modelica"
                style={{ marginInlineEnd: "min(3vw, 32px)" }}
              ></RgbyText>
              <RgbyText size="min(7vw, 72px)" value="Hub"></RgbyText>
            </Box>
            <Box>
              <TextInput
                placeholder="Search..."
                value={value}
                onChange={handleChange}
                block
                onKeyDown={onKeyDown}
                trailingAction={
                  <TextInput.Action
                    icon={SearchIcon}
                    onClick={onClick}
                    aria-label="Search"
                    variant="primary"
                    sx={{ height: 32, width: 32 }}
                  ></TextInput.Action>
                }
                size="large"
              ></TextInput>
            </Box>
          </PageLayout.Content>
        </PageLayout>
      </Box>
    </Box>
  );
}
