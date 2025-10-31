const fs = require('fs').promises
const path = require('path')
const matter = require('gray-matter')
const crypto = require('crypto')

// Cache file path
const CACHE_FILE_PATH = path.join(__dirname, '../.content-hash-cache.json')

// Calculate MD5 hash of content
const calculateHash = content => {
  return crypto.createHash('md5').update(content).digest('hex')
}

// Read cache from file
const readCache = async () => {
  try {
    const cacheData = await fs.readFile(CACHE_FILE_PATH, 'utf-8')
    return JSON.parse(cacheData)
  } catch (error) {
    // Return empty object if cache file doesn't exist or can't be read
    return {}
  }
}

// Write cache to file
const writeCache = async cache => {
  await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf-8')
}

// Get file modification time
const getFileMtime = async filePath => {
  try {
    const stats = await fs.stat(filePath)
    return stats.mtimeMs
  } catch (error) {
    console.error(`Failed to get file modification time: ${filePath}`, error)
    return 0
  }
}

const updateFrontmatter = async (filePath, forceUpdate = false) => {
  const cache = await readCache()
  const mtime = await getFileMtime(filePath)
  const fileName = path.basename(filePath)

  const fileInCache = cache[fileName] !== undefined

  if (fileInCache && cache[fileName].mtime === mtime && !forceUpdate) {
    console.log(`File modification time unchanged, skipping: ${fileName}`)
    return false
  }

  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(fileContent)

  const hash = calculateHash(content)
  const hashChanged = fileInCache && cache[fileName].hash !== hash

  if (forceUpdate || hashChanged) {
    const newFrontmatter = { ...frontmatter, updatedOn: new Date().toISOString() }
    const updatedFileContent = matter.stringify(content, newFrontmatter)
    await fs.writeFile(filePath, updatedFileContent)

    cache[fileName] = { hash, mtime }
    await writeCache(cache)
    return true
  } else {
    if (!fileInCache) {
      cache[fileName] = { hash, mtime }
    } else if (cache[fileName].mtime !== mtime) {
      cache[fileName].mtime = mtime
    }
    await writeCache(cache)
    return false
  }
}

module.exports = {
  updateFrontmatter,
}
