import { useCallback, useMemo, useState } from "react";

const getAverage = (numbers: number[]) => {
    console.log("평균 값을 계산 중입니다.");

    if (numbers.length === 0) return 0;

    const sum = numbers.reduce((acc, cur) => acc + cur);
    return sum / numbers.length;
};

function App() {
    // useCallback
    // useCallback은 useMemo와 상당히 비슷한 함수입니다. 주로 렌더링 성능을 최적화해야 하는 상황에서 사용합니다.
    // 이 훅(Hook)을 사용하면 만들어 놓았던 함수를 재사용할 수 있습니다.

    // useCallback의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고,
    // useCallback의 두 번째 파라미터에는 배열을 넣으면 됩니다.
    // 이 배열에는 어떤 값이 바뀌었을 때, 함수를 새로 생성해야 하는지 명시해야 합니다.

    // onChange처럼 비어 있는 배열을 넣게 되면 컴포넌트가 렌더링 될 때, 만들었던 함수를 계속해서 재사용하게 되며
    // onInsert처럼 배열 안에 number와 list를 넣게 되면, 인풋 내용이 바뀌거나 새로운 항목이 추가 되었을 때
    // 새로 만들어진 함수를 사용하게 됩니다.

    const [list, setList] = useState<number[]>([]);
    const [number, setNumber] = useState<string>(""); // => 실제 input 태그에 입력된 숫자를 list 배열에 주입할 것이기 때문에
    // 상태 값 이름을 number 지정했습니다. 단, input 태그에 입력된 값이기 때문에 데이터 타입은 string 입니다.

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(event.target.value);
    }, []); // 컴포넌트가 처음 렌더링 될 때만 함수를 생성한다.

    const onInsert = useCallback(() => {
        console.log(list);
        // concat: Array 인스턴스의 concat 함수는 두 개 이상의 배열을 병합하는 데 사용됩니다. 이 메서드는 기존 배열을 변경하지 않고, 새 배열을 반환합니다.
        // parseInt: 무자열 인자를 파싱하여 특정 진수(수의 진법 체계에서 기준이 되는 값)의 정수를 반환합니다.
        const newList = list.concat(parseInt(number));
        setList(newList); // number[]
        setNumber(""); // number 상태 값 초기화
    }, [number, list]);

    // useCallback은 첫 렌더링 때 한 번만 함수 onInsert를 생성합니다. ([])
    // onInsert 안에서 사용하는 list, number는 초기값의 복사본으로 함수 안에 "닫혀(closed over)" 있습니다.
    // 이후 number나 list가 변경되어도, onInsert는 옛날 값을 계속 사용합니다.

    // 이게 클로저(closure) 문제입니다.

    const average = useMemo(() => getAverage(list), [list]);

    return (
        <div>
            <input type="text" value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>

            <ul>
                {list.map((item: number, index: number) => {
                    return <li key={index}>{item}</li>;
                })}
            </ul>

            <div>
                <b>평균 값: {average}</b>
            </div>
        </div>
    );
}

export default App;
