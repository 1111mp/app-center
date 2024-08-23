export enum TokenSource {
  WEB = 1, // Web App
  USER = 2, // User
  TOOLS = 3, // Compilation Tools
  DESKTOP = 4, // Desktop
}

export enum TokenType {
  FOREVER = 1, // Forever
  ONE_TIME = 2, // One-Time
  TIME_LIMITED = 3, // Has an expiration date
}
