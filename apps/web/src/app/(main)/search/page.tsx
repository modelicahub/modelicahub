"use client";

import { gql, useQuery } from "@apollo/client";
import { Box, PageLayout, Text, Token } from "@primer/react";
import { RepoIcon } from "@primer/styled-octicons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const SEARCH = gql`
  query search($q: String!) {
    search(q: $q) {
      description
      title
    }
  }
`;

export default function SearchPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading, error, data, refetch } = useQuery(SEARCH, {
    variables: { q: searchParams.get("q") },
  });
  return (
    <PageLayout containerWidth="full">
      <PageLayout.Content>
        <Box sx={{ fontSize: 2, fontWeight: 600 }}>
          {data?.search?.length ?? 0} packages found
        </Box>
        {data &&
          data.search.map((result: any, i: number) => (
            <Box
              sx={{
                borderBottom: "solid 1px var(--borderColor-default)",
                py: 3,
              }}
            >
              <Box sx={{ fontWeight: 600, fontSize: 2 }}>
                <Text sx={{ "&:hover": { textDecoration: "underline" } }}>
                  <Link
                    href="/package/jest-dom"
                    style={{
                      textDecoration: "none",
                      color: "var(--fgColor-accent)",
                    }}
                  >
                    {result.title}
                  </Link>
                </Text>
              </Box>
              <Box sx={{ color: "var(--fgColor-muted)", fontSize: 1, py: 1 }}>
                Custom jest matchers to test the state of the DOM
              </Box>
              <Box sx={{ py: 1 }}>
                <Token text="abc" sx={{ marginInlineEnd: 5 }} />
                <Token text="abc" sx={{ marginInlineEnd: 5 }} />
                <Token text="abc" sx={{ marginInlineEnd: 5 }} />
                <Token text="abc" sx={{ marginInlineEnd: 5 }} />
                <Token text="abc" sx={{ marginInlineEnd: 5 }} />
              </Box>
              <Box sx={{ py: 1, fontFamily: "monospace", fontSize: 1 }}>
                <RepoIcon size={18}></RepoIcon>
                <Text
                  sx={{
                    mx: 2,
                    fontWeight: 500,
                    color: "var(--fgColor-default)",
                  }}
                >
                  testing-library-bot
                </Text>
                <Text sx={{ color: "var(--fgColor-muted)" }}>
                  published 6.4.6 • 21 days ago
                </Text>
              </Box>
            </Box>
          ))}
      </PageLayout.Content>
    </PageLayout>
  );
}
