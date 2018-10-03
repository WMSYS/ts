import typescript from "typescript"
import { Options } from "./options"

const tsconfigDefaults = {
  options: {
    esModuleInterop: true,
    lib: ["es2015"],
    newLine: "lf",
    module: "commonjs",
    moduleResolution: "node",
    outDir: "dist/",
    strict: true,
    target: "es5"
  }
}

const dedupe = <T>(array: T[]): T[] => Array.from(new Set(array))

export function getCompilerOptions (cliFlags: any, options: Options, packageJsonData: any) {
  const packageJsonConfig = packageJsonData.ts || {}

  const compilerOptions = {
    ...tsconfigDefaults.options,
    ...(packageJsonConfig.compilerOptions || {})
  }

  if (cliFlags.declaration) {
    compilerOptions.declaration = true
  }
  if (cliFlags.jsx) {
    compilerOptions.jsx = cliFlags.jsx
  }
  if (cliFlags.lib) {
    compilerOptions.lib = cliFlags.lib.split(",")
  }
  if (cliFlags.noStrict) {
    compilerOptions.strict = false
  }
  if (cliFlags.outDir) {
    compilerOptions.outDir = cliFlags.outDir
  }
  if (cliFlags.outModule) {
    compilerOptions.module = cliFlags.outModule
  }
  if (cliFlags.skipLibCheck) {
    compilerOptions.skipLibCheck = true
  }
  if (cliFlags.sourceMaps) {
    compilerOptions.sourceMap = true
  }
  if (cliFlags.target) {
    compilerOptions.target = cliFlags.target
  }
  if (options.monorepo) {
    compilerOptions.paths = {
      ...compilerOptions.paths,
      "*": dedupe([
        ...(compilerOptions.paths && compilerOptions.paths["*"] ? compilerOptions.paths["*"] : ["./node_modules/*"]),
        "../../node_modules/*"
      ])
    }
  }

  if (compilerOptions.paths && !compilerOptions.baseUrl) {
    compilerOptions.baseUrl = "."
  }

  return compilerOptions
}

export function parseCompilerOptions (compilerOptions: any) {
  const parsed = typescript.parseJsonConfigFileContent({ compilerOptions }, typescript.sys, ".")
  return parsed.options
}