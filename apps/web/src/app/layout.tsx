"use client";

import { BaseStyles, Box, ThemeProvider } from "@primer/react";
import "./globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%" }}>
        <ApolloProvider client={client}>
          <ThemeProvider colorMode="auto" preventSSRMismatch>
            <BaseStyles style={{ height: "100%" }}>
              <Box
                sx={{
                  backgroundColor: "var(--bgColor-default)",
                  height: "100%",
                }}
              >
                {children}
              </Box>
            </BaseStyles>
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
