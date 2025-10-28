// styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      text: string;
      gray: string;
      darkGray: string;
      accent: string;
      cardBg: string;
      shadow: string;
      conversationBg?: string;
    };
  }
}
