import {motion} from "framer-motion";
import {InstagramIcon, LinkedInIcon, FacebookIcon} from "./Icons";
import logoBW from "../../src/assets/img/logoBw.png";

const Footer = () => {
    return (
        <footer className="w-full flex justify-center flex-wrap font-semibold bg-jet">
            <div className="w-full flex flex-row justify-between">
                <img className="w-1/5 h-auto rounded-xl py-8 pl-24" src={logoBW} alt={'logo'}/>
                <div className="flex items-center justify-end w-full p-6">
                    <motion.a href='/'
                              target={"_blank"}
                              whileHover={{y: -3}}
                              whileTap={{scale: 0.9}}
                              className='w-[3rem] mx-3'
                    >
                        <InstagramIcon/>
                    </motion.a>
                    <motion.a href='https://www.linkedin.com/in/eric-tourvieille-de-labrouhe-web-developer/'
                              target={"_blank"}
                              whileHover={{y: -3}}
                              whileTap={{scale: 0.9}}
                              className='w-[2rem] mx-3'
                    >
                        <LinkedInIcon/>
                    </motion.a>
                    <motion.a href='https://www.linkedin.com/in/eric-tourvieille-de-labrouhe-web-developer/'
                              target={"_blank"}
                              whileHover={{y: -3}}
                              whileTap={{scale: 0.9}}
                              className='w-[2rem] mx-4'
                    >
                        <FacebookIcon/>
                    </motion.a>
                </div>
            </div>
            <p className="flex justify-center text-center text-smoke mb-8">&copy; EvenTease {new Date().getFullYear()} |
                All Rights Reserved | Eric Tourvieille</p>
        </footer>
    );
};

export default Footer;