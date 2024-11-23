import { FileLoader } from 'three'

export function loadShader(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const loader = new FileLoader()
    loader.load(
      filePath,
      (data) => resolve(data as string),
      undefined,
      (err) => reject(err),
    )
  })
}
