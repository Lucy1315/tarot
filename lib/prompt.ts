interface ReadingCard {
  position: string;
  name: string;
  reversed: boolean;
}

interface ReadingInput {
  spreadName: string;
  question: string;
  cards: ReadingCard[];
}

export function buildReadingPrompt(input: ReadingInput): string {
  const cardList = input.cards
    .map(
      (c) =>
        `- ${c.position}: ${c.name}${c.reversed ? " (역방향)" : ""}`
    )
    .join("\n");

  const questionLine = input.question
    ? `\n질문: ${input.question}\n`
    : "";

  return `당신은 숙련된 타로 카드 리더입니다. 따뜻하고 통찰력 있는 해석을 한국어로 제공합니다.

스프레드: ${input.spreadName}${questionLine}

카드 배치:
${cardList}

위 카드 배치를 기반으로 타로 리딩을 해주세요.

규칙:
1. 각 포지션별로 카드의 의미를 해석해주세요
2. 역방향 카드는 역방향의 의미를 반영해주세요
3. 카드 간의 관계와 흐름을 설명해주세요
4. 마지막에 종합적인 메시지를 전달해주세요
5. 따뜻하고 긍정적이되, 솔직한 톤을 유지해주세요`;
}
