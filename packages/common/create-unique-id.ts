export default function createUniqueId(): string {
  let uniqueId = ''
  const length = 32
  const alphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict'
  const alphabetLength = alphabet.length
  for (var i = 0; i < length; i++) {
    uniqueId += alphabet.charAt(Math.floor(Math.random() * alphabetLength))
  }
  return uniqueId
}
