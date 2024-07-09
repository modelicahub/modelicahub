"use client";

import { RgbyText } from "@modelicahub/ui/rgby-text";
import {
  Box,
  Button,
  Header,
  Label,
  PageLayout,
  TextInput,
} from "@primer/react";
import { SearchIcon } from "@primer/styled-octicons";
import Head from "next/head";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <Header
        sx={{
          backgroundColor: "var(--bgColor-default)",
          borderBottom: "solid 1px var(--borderColor-default)",
          color: "var(--fgColor-default)",
        }}
      >
        <Header.Item>
          <Link href="/" legacyBehavior passHref>
            <Header.Link>
              <RgbyText
                size="24px"
                value="Modelica"
                style={{ marginInlineEnd: "8px" }}
              ></RgbyText>
              <RgbyText
                size="24px"
                value="Hub"
                style={{ marginInlineEnd: "8px" }}
              ></RgbyText>
            </Header.Link>
          </Link>
        </Header.Item>
        <Header.Item sx={{ width: 400 }}>
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
        </Header.Item>
      </Header>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}
