import { useEffect, useRef, useState } from "react";

const validateHexInput = (input: string) => {
  const validHexChar = /^[0-9A-Fa-f]$/;
  return validHexChar.test(input);
};

const HashPicker = () => {
  const [activePicker, setActivePicker] = useState<"binary" | "hex">("binary");
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [hexHashPick, setHexHashPick] = useState<string>("0");
  const [isHexValid, setIsHexValid] = useState<boolean>(true);

  const hexInputRef = useRef<HTMLInputElement>(null);

  const handleTogglePicker = (picker: "binary" | "hex") => {
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
    if (activePicker === "hex" && hexInputRef.current) {
      hexInputRef.current.focus();
    }
  }, [activePicker]);

  return (
    <div className="flex flex-col w-full">
      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-left">Bit Selector</h1>
          <h2 className="text text-gray-600 text-left">Guess the last digit of the upcoming block</h2>
        </div>
        <div className="flex items-center bg-gray-200 rounded-md p-1">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activePicker === "binary" ? "bg-white shadow" : "bg-transparent"
            }`}
            onClick={() => handleTogglePicker("binary")}
          >
            Bin
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activePicker === "hex" ? "bg-white shadow" : "bg-transparent"
            }`}
            onClick={() => handleTogglePicker("hex")}
          >
            Hex
          </button>
        </div>
      </div>

      {/* Picker */}
      <div className="flex justify-center items-center">
        {activePicker === "binary" ? (
          <div className="flex space-x-2">
            {binaryHashPick.map((bit, index) => (
              <button
                key={index}
                className="w-20 h-20 bg-gray-200 text-4xl font-bold rounded-md"
                onClick={() => handleToggleBinaryHashPick(index)}
              >
                {bit}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative flex justify-center items-center">
            {/* Centered Input Box */}
            <div className="relative flex flex-col items-center">
              <input
                ref={hexInputRef}
                type="text"
                maxLength={1}
                value={hexHashPick}
                className={`w-20 h-20 text-center text-4xl font-bold rounded-md ${
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
