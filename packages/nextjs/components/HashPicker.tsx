import { useEffect, useRef, useState } from "react";

const validateHexInput = (input: string) => {
  const validHexChar = /^[0-9A-Fa-f]$/;
  return validHexChar.test(input);
};

enum HashPickerMode {
  BIN = "BIN",
  HEX = "HEX",
}

const HashPicker = () => {
  const [activePicker, setActivePicker] = useState<HashPickerMode>(HashPickerMode.BIN);
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [hexHashPick, setHexHashPick] = useState<string>("0");
  const [isHexValid, setIsHexValid] = useState<boolean>(true);

  const hexInputRef = useRef<HTMLInputElement>(null);

  const handleTogglePicker = (picker: HashPickerMode) => {
    setActivePicker(picker);
  };

  const handleToggleBinaryHashPick = (index: number) => {
    setBinaryHashPick(prev => {
      const newHashPick = [...prev];
      newHashPick[index] = newHashPick[index] === "0" ? "1" : "0";
      return newHashPick;
    });
  };

  const handleHexInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setHexHashPick: React.Dispatch<React.SetStateAction<string>>,
    setIsHexValid: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    e.preventDefault();

    const key = e.key.toUpperCase();

    if (validateHexInput(key)) {
      setHexHashPick(key);
      setIsHexValid(true);
    } else if (key === "BACKSPACE") {
      setHexHashPick("");
      setIsHexValid(true);
    } else {
      setHexHashPick(key);
      setIsHexValid(false);
    }
  };

  useEffect(() => {
    if (activePicker === HashPickerMode.HEX && hexInputRef.current) {
      hexInputRef.current.focus();
    }
  }, [activePicker]);

  const modes: HashPickerMode[] = [HashPickerMode.BIN, HashPickerMode.HEX];

  return (
    <div className="flex flex-col w-full">
      {/* Heading */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-medium text-slate-900 text-left mb-0">Bit Selector</h1>
          <h2 className="text-sm text-slate-600 text-left">Guess the last digit of the upcoming block</h2>
        </div>
        <div className="flex items-center bg-gray-200 rounded-md p-1">
          {modes.map((mode: HashPickerMode) => (
            <button
              key={mode}
              className={`flex-1 px-4 py-2 text-sm rounded-md font-medium ${
                activePicker === mode ? "bg-white shadow" : "bg-transparent"
              }`}
              onClick={() => handleTogglePicker(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Picker */}
      <div className="flex justify-start items-start">
        {activePicker === HashPickerMode.BIN ? (
          <div className="flex space-x-2 w-full h-[90px]">
            {binaryHashPick.map((bit, index) => (
              <button
                key={index}
                className="flex flex-1 bg-gray-200 text-5xl font-bold rounded-md items-center justify-center"
                onClick={() => handleToggleBinaryHashPick(index)}
              >
                {bit}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative flex justify-start items-center">
            {/* Centered Input Box */}
            <div className="relative flex flex-col items-start h-[90px]">
              <input
                ref={hexInputRef}
                type="text"
                maxLength={1}
                value={hexHashPick}
                className={`w-[106px] h-[90px] text-center text-5xl font-bold rounded-md ${
                  isHexValid ? "bg-gray-200 text-black" : "bg-red-100 text-red-600"
                }`}
                onKeyDown={e => handleHexInput(e, setHexHashPick, setIsHexValid)}
                style={{ caretColor: "transparent" }}
              />
            </div>
            {/* Fixed Position for Warning Message */}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-[calc(100%+10px)] w-32 text-sm text-red-600 break-words">
              {!isHexValid && "Must be a hexadecimal character (0-9, A-F)."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashPicker;
