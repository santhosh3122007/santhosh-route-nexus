
import React from 'react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative">
      <input
        id={id}
        className="
          w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg
          text-white placeholder-slate-400
          transition-all duration-300 ease-in-out
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
          peer
        "
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="
          absolute text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10
          origin-[0] bg-slate-900 px-2 left-2
          peer-focus:px-2 peer-focus:text-blue-400
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
          peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
          pointer-events-none
        "
      >
        {label}
      </label>
    </div>
  );
};

export default AnimatedInput;
