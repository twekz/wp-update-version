/**
 * Very simple regex for version number
 */
const VERSION_REGEX = '[.\\S]+';

/**
 * Replace version number in a PHP comment block
 * @param fileContent
 * @param version
 */
export function updatePHPHeaderVersion (fileContent: string, version: string) {
  const commentRegex = new RegExp(`\\s*\\*\\s*(Version):\\s*(${VERSION_REGEX})\\n`);
  const commentMatch: RegExpExecArray | null = commentRegex.exec(fileContent);

  if (commentMatch != null) {
    const oldComment = commentMatch[0];
    const newComment = oldComment.slice(0).replace(commentMatch[2], version);
    fileContent = fileContent.replace(oldComment, newComment);
  }

  return fileContent;
}

/**
 * Replace version number in a CSS comment block
 * @param fileContent
 * @param version
 */
export function updateCSSHeaderVersion (fileContent: string, version: string) {
  const commentRegex = new RegExp(`\\s*\\**\\s*(Version):\\s*(${VERSION_REGEX})\\n`);
  const commentMatch: RegExpExecArray | null = commentRegex.exec(fileContent);

  if (commentMatch != null) {
    const oldComment = commentMatch[0];
    const newComment = oldComment.slice(0).replace(commentMatch[2], version);
    fileContent = fileContent.replace(oldComment, newComment);
  }

  return fileContent;
}

/**
 * Replace version number in a PHP constant definition
 * @param fileContent
 * @param version
 * @param constantName - name of the constant
 */
export function updatePHPConstantVersion (fileContent: string, version: string, constantName: string) {
  const syntaxes = [
    `define\\(\\s*(['"])${constantName}\\2\\s*,\\s*(['"])(?<v1>${VERSION_REGEX})\\3\\s*\\)`,
    `const\\s*${constantName}\\s*=\\s*(['"])(?<v2>${VERSION_REGEX})\\5`
  ];
  const constantRegex = new RegExp(`(${syntaxes.join('|')})`, 'g');

  let match;
  while ((match = constantRegex.exec(fileContent)) !== null) {
    const oldConstant = match[0];
    const oldVersion = match.groups?.v1 ?? match.groups?.v2;
    if (oldVersion != null) {
      const newConstant = oldConstant.slice(0).replace(oldVersion, version);
      fileContent = fileContent.replace(oldConstant, newConstant);
    }
  }

  return fileContent;
}
