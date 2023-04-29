/*
* appdirs.ts
*
* Copyright (C) 2020-2022 Posit Software, PBC
*
*/

import { join } from "path/mod.ts";
import { ensureDirSync } from "fs/mod.ts";

export function quartoDataDir(subdir?: string, roaming = false) {
  return quartoDir(userDataDir, subdir, roaming);
}

export function quartoConfigDir(subdir?: string, roaming = false) {
  return quartoDir(userConfigDir, subdir, roaming);
}

export function quartoCacheDir(subdir?: string) {
  return quartoDir(userCacheDir, subdir);
}

export function quartoRuntimeDir(subdir?: string) {
  return quartoDir(userRuntimeDir, subdir);
}

function quartoDir(
  sourceFn: (appName: string, roaming?: boolean) => string,
  subdir?: string,
  roaming?: boolean,
) {
  const dir = sourceFn("quarto", roaming);
  const fullDir = subdir ? join(dir, subdir) : dir;
  ensureDirSync(fullDir);
  return fullDir;
}

export function userDataDir(appName: string, roaming = false):string {
  switch (Deno.build.os) {
    case "darwin":
      return darwinUserDataDir(appName);
    case "linux":
      return xdgUserDataDir(appName);
    case "windows":
      return windowsUserDataDir(appName, roaming);
  }
  return '';
}

export function userConfigDir(appName: string, roaming = false):string {
  switch (Deno.build.os) {
    case "darwin":
      return darwinUserDataDir(appName);
    case "linux":
      return xdgUserConfigDir(appName);
    case "windows":
      return windowsUserDataDir(appName, roaming);
  }
  return '';
}

export function userCacheDir(appName: string):string {
  switch (Deno.build.os) {
    case "darwin":
      return darwinUserCacheDir(appName);
    case "linux":
      return xdgUserCacheDir(appName);
    case "windows":
      return windowsUserDataDir(appName);
  }
  return '';
}

export function userRuntimeDir(appName: string):string {
  switch (Deno.build.os) {
    case "darwin":
      return darwinUserCacheDir(appName);
    case "linux":
      return xdgUserRuntimeDir(appName);
    case "windows":
      return windowsUserDataDir(appName);
  }
  return '';
}

function darwinUserDataDir(appName: string):string {
  return join(
    Deno.env.get("HOME") || "",
    "Library",
    "Application Support",
    appName,
  );
  return '';
}

function darwinUserCacheDir(appName: string):string {
  return join(
    Deno.env.get("HOME") || "",
    "Library",
    "Caches",
    appName,
  );
  return '';
}

function xdgUserDataDir(appName: string):string {
  const dataHome = Deno.env.get("XDG_DATA_HOME") ||
    join(Deno.env.get("HOME") || "", ".local", "share");
  return join(dataHome, appName);
}

function xdgUserConfigDir(appName: string):string {
  const configHome = Deno.env.get("XDG_CONFIG_HOME") ||
    join(Deno.env.get("HOME") || "", ".config");
  return join(configHome, appName);
}

function xdgUserCacheDir(appName: string):string {
  const cacheHome = Deno.env.get("XDG_CACHE_HOME") ||
    join(Deno.env.get("HOME") || "", ".cache");
  return join(cacheHome, appName);
}

function xdgUserRuntimeDir(appName: string):string {
  const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");
  if (runtimeDir) {
    return runtimeDir;
  } else {
    return xdgUserDataDir(appName);
  }
  return '';
}

function windowsUserDataDir(appName: string, roaming = false):string {
  const dir =
    (roaming ? Deno.env.get("APPDATA") : Deno.env.get("LOCALAPPDATA")) || "";
  return join(dir, appName);
}
