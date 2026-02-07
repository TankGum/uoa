import { motion, AnimatePresence } from 'framer-motion'
import { useUploads } from '../context/UploadContext'

export default function UploadStatusIndicator() {
    const { activeUploads, removeUpload } = useUploads()

    if (activeUploads.length === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-4 w-80">
            <AnimatePresence>
                {activeUploads.map((upload) => (
                    <motion.div
                        key={upload.id}
                        initial={{ opacity: 0, y: 50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        className="bg-zinc-900 border border-white/10 p-4 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="min-w-0 pr-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                                    {upload.status === 'completed' ? 'Finished' : upload.status === 'error' ? 'Error' : 'Syncing...'}
                                </h4>
                                <p className="text-white font-bold text-sm truncate">{upload.title}</p>
                            </div>
                            <button
                                onClick={() => removeUpload(upload.id)}
                                className="text-zinc-500 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {upload.status === 'error' ? (
                            <p className="text-xs text-red-400 font-medium italic mt-2">
                                {upload.error || 'Unknown error occurred'}
                            </p>
                        ) : (
                            <div className="mt-3">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-[#e8bb69] mb-1">
                                    <span>{upload.status}</span>
                                    <span>{upload.progress}%</span>
                                </div>
                                <div className="h-1 bg-zinc-800 w-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${upload.progress}%` }}
                                        className="h-full bg-[#e8bb69]"
                                    />
                                </div>
                            </div>
                        )}

                        {upload.status === 'completed' && (
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Done
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
