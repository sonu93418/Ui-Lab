import fse from 'fs-extra';

export const fs = {
  exists: (p: string) => fse.pathExists(p),
  readJson: <T = unknown>(p: string): Promise<T> => fse.readJson(p) as Promise<T>,
  writeJson: (p: string, data: unknown) => fse.writeJson(p, data, { spaces: 2 }),
  readFile: (p: string) => fse.readFile(p, 'utf8'),
  writeFile: (p: string, content: string) => fse.outputFile(p, content, 'utf8'),
  copyFile: (src: string, dest: string) => fse.copy(src, dest),
  ensureDir: (p: string) => fse.ensureDir(p),
  remove: (p: string) => fse.remove(p),
};
