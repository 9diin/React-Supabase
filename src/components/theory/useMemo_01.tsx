import { useState } from "react";

const getAverage = (numbers: number[]) => {
    console.log("평균 값을 계산 중입니다.");

    if (numbers.length === 0) return 0;

    const sum = numbers.reduce((acc, cur) => acc + cur);
    return sum / numbers.length;
};

function App() {
    const [list, setList] = useState<number[]>([]);
    const [number, setNumber] = useState<string>(""); // => 실제 input 태그에 입력된 숫자를 list 배열에 주입할 것이기 때문에
    // 상태 값 이름을 number 지정했습니다. 단, input 태그에 입력된 값이기 때문에 데이터 타입은 string 입니다.

    const onInsert = () => {
        // concat: Array 인스턴스의 concat 함수는 두 개 이상의 배열을 병합하는 데 사용됩니다. 이 메서드는 기존 배열을 변경하지 않고, 새 배열을 반환합니다.
        // parseInt: 무자열 인자를 파싱하여 특정 진수(수의 진법 체계에서 기준이 되는 값)의 정수를 반환합니다.
        const newList = list.concat(parseInt(number));
        setList(newList); // number[]
        setNumber("");
    };

    return (
        <div>
            <input type="text" value={number} onChange={(event) => setNumber(event.target.value)} />
            <button onClick={onInsert}>등록</button>

            <ul>
                {list.map((item: number, index: number) => {
                    return <li key={index}>{item}</li>;
                })}
            </ul>

            <div>
                <b>평균 값: {getAverage(list)}</b>
            </div>
        </div>
    );
}

export default App;
