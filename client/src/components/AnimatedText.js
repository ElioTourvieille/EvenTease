import { motion } from "framer-motion";

const quote = {
    initial: {
        opacity: 0,
    },
    animate:{
        opacity: 1,
        transition: {
            duration: 0.3,
            delay:  0.1,
        }
    }
}

const AnimatedText = ({text, className=""}) => {
    return (
        <div className="w-full mx-auto py-2 flex items-center justify-center text-center
         overflow-hidden sm:py-0">
            <motion.h1
                className={`inline-block w-full text-azure font-bold text-5xl uppercase ${className}`}
                variants={quote}
                initial="initial"
                animate="animate"
            >
                {text.split("").map((letter, letterIndex) => (
                    <motion.span
                        key={letter + '-' + letterIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration:0.3, delay: letterIndex * 0.07 }} // Delay each letter by 0.1 seconds
                    >
                        {letter}
                    </motion.span>
                ))}
                &nbsp;
            </motion.h1>
        </div>
    );
};

export default AnimatedText;