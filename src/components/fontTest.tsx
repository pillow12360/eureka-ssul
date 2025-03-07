const FontTest = () => {
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold">AritaBuriKR 폰트 테스트</h1>

      <div className="grid gap-4">
        <p className="font-thin">
          아리타부리 헤어라인 (font-thin): 가나다라마바사아자차카타파하
        </p>
        <p className="font-light">
          아리타부리 라이트 (font-light): 가나다라마바사아자차카타파하
        </p>
        <p className="font-normal">
          아리타부리 미디움 (font-normal): 가나다라마바사아자차카타파하
        </p>
        <p className="font-semibold">
          아리타부리 세미볼드 (font-semibold): 가나다라마바사아자차카타파하
        </p>
        <p className="font-bold">
          아리타부리 볼드 (font-bold): 가나다라마바사아자차카타파하
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">다양한 크기</h2>
        <p className="text-xs">텍스트 XS</p>
        <p className="text-sm">텍스트 SM</p>
        <p className="text-base">텍스트 Base</p>
        <p className="text-lg">텍스트 LG</p>
        <p className="text-xl">텍스트 XL</p>
        <p className="text-2xl">텍스트 2XL</p>
        <p className="text-3xl">텍스트 3XL</p>
      </div>
    </div>
  );
};

export default FontTest;
