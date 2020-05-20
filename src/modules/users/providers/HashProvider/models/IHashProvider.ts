export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hasged: string): Promise<boolean>;
}
