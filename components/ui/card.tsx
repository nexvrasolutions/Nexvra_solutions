import { Button } from './button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const Card = ({ course, className, contClassName, isCourse = true }: { course: any, className?: string, contClassName?:string, isCourse?: boolean }) => {

    const containerVariants: any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.05,
            },
        },
    };

    const itemVariants: any = {
        hidden: {
            y: 30,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <a
            href={
                isCourse
                    ? `/course-detail/${course.slug}`
                    : ``
            }
            className="w-full h-full"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, scale: 1.02 }}
                className={cn("bg-white rounded-md p-5 lg:p-3 xl:p-6 transition flex flex-col w-full h-full  justify-between items-start gap-5 xl:gap-5",  isCourse ? "h-full md:min-h-[420px]" : "min-h-[300px]", contClassName)}
            >

                {/* Image */}
                <motion.div variants={itemVariants}>
                    <img
                        src={course.img || "/images/green-eye.png"}
                        alt={`nexvra-solution-${course.slug || course.title}`}
                        className="size-25 object-contain"
                    />
                </motion.div>

                <div className={cn("space-y-3", className)}>

                    {/* Title */}
                    <motion.h3
                        variants={itemVariants}
                        className={cn(
                            isCourse
                                ? "text-xl min-h-[3.5rem] xl:text-2xl font-semibold leading-tight xl:leading-8 font-secondary"
                                : "font-primary text-xl font-semibold leading-tight xl:leading-10"
                        )}
                    >
                        {Array.isArray(course.title) ? (
                            course.title.map((line: string, i: number) => (
                                <span key={i} className="block">
                                    {line}
                                </span>
                            ))
                        ) : (
                            course.title
                        )}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-gray-500 leading-6"
                    >
                        {course.description}
                    </motion.p>

                    {/* Meta */}
                    {isCourse && (
                        <motion.div
                            variants={itemVariants}
                            className="text-sm flex gap-0.5 w-full items-center text-[#404040]"
                        >
                            <p>{course.duration}</p>
                            <span className="mx-2 size-1.5 rounded-full bg-[#404040]"></span>
                            <p>{course.difficulty}</p>
                        </motion.div>
                    )}

                    {!isCourse && (
                        <motion.p
                            variants={itemVariants}
                            className="text-lg font-medium flex gap-0.5 items-center text-gray-500"
                        >
                            {course.desc}
                        </motion.p>
                    )}
                </div>

                {/* Buttons */}
                {isCourse && (
                    <motion.div variants={itemVariants} className="w-full">
                        <div className="w-full">
                            <Button
                                label="Enroll Now"
                                className="w-full flex items-center justify-center"
                            />
                        </div>

                        <button className="w-full mt-3 text-gray-600 hover:text-black text-sm transition">
                            View Details
                        </button>
                    </motion.div>
                )}

            </motion.div>
        </a>
    )
}
