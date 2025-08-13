import { useRef } from "react";

function App() {
    // useRef
    // useRef 훅(Hook)은 함수 컴포넌트에서 ref라는 속성을 쉽게 사용할 수 있도록 도와주는 도구입니다.
    // React의 useRef는 컴포넌트 내에서 변하지 않는 값을 유지하거나 DOM 요소에 직접 접근할 때 사용하는 훅(Hook)입니다.
    // 다른 React Hook과 목적이 다릅니다.

    // useRef는 값을 저장하거나 DOM에 접근하기 위해 사용하는 객체(참조값)를 생성하는 Hook입니다.
    // 저장된 값은 컴포넌트가 리렌더링되어도 유지되며, 값이 바뀌어도 리렌더링을 일으키지 않습니다.

    // ref 속성은 JSX, TSX에서 요소나 컴포넌트에 참조를 연결하는 역할
    // App 컴포넌트에서 등록 버튼을 눌렀을 때, 포커스가 인풋 태그 쪽으로 넘어가도록 코드를 작성해 보도록 하겠습니다.

    const inputElement = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        // useRef 동작
        inputElement.current?.focus();
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input type="text" ref={inputElement} />
            <input type="file" ref={fileInputRef} />
            <button onClick={handleClick}>등록</button>
        </div>
    );
}

export default App;
