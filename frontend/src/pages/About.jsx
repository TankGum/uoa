import { motion } from 'framer-motion'

function About() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#e8bb69] selection:text-zinc-950 pt-20">
      {/* Hero Section - Editorial style */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#e8bb69]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#e8bb69] font-bold">Stories</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                Câu chuyện<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8bb69] to-[#cfb970]">Của chúng tôi</span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:max-w-md text-right md:text-left"
            >
              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic border-r-4 border-[#e8bb69] pr-6 md:border-r-0 md:border-l-4 md:pl-6">
                Tạo ra những câu chuyện đầy sáng tạo và tính thử nghiệm bằng hình ảnh, vượt qua mọi giới hạn truyền thống.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#e8bb69] opacity-[0.02] -skew-x-12 translate-x-1/2" />
        <div className="absolute top-20 left-10 text-[20vw] font-black text-white opacity-[0.01] pointer-events-none select-none uppercase">
          Studio
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Visual Column */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5">
                <img
                  src="https://instagram.fhan2-3.fna.fbcdn.net/v/t15.5256-10/485127525_1764339070806863_8481621297115392356_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=MzU5MDI3NTQ0MjM5OTczMDA4OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=pFS36wu73PIQ7kNvwE-nJHr&_nc_oc=AdlRyzTZynnzFhWF8srrgL0Xj91SLxQ3-RpdpUm8QHs9MmPLrHBbB1ZsLIllBi0fU0s&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fhan2-3.fna&_nc_gid=3puzN1xG0-OffCCrsZelRw&oh=00_AftbgfwS5eV2bgbzCFU4vW7nz5rkujSnQtUwoxJbzxettQ&oe=698D214E"
                  alt="Photography art"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-[#e8bb69] opacity-20 pointer-events-none" />
              <div className="absolute -top-4 -left-4 p-8 bg-zinc-950 border border-white/5 hidden md:block">
                <span className="text-6xl font-black text-white/5 select-none uppercase tracking-tighter italic">Creative</span>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-24">

              {/* Tầm nhìn */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#e8bb69] tracking-widest">01</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Tầm nhìn</h2>
                </div>
                <div className="h-px w-24 bg-[#e8bb69]" />
                <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                  Chúng tôi tin vào sức mạnh của việc kể câu chuyện bằng hình ảnh để biến thương hiệu và tạo ra những ấn tượng lâu dài. Mỗi khung hình chúng tôi bắt, mỗi câu chuyện chúng tôi kể, đều được tạo ra với độ chính xác và đam mê.
                </p>
              </motion.div>

              {/* Những gì chúng tôi làm */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#e8bb69] tracking-widest">02</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Chúng tôi làm</h2>
                </div>
                <div className="h-px w-24 bg-[#e8bb69]" />
                <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                  Đội ngũ chuyên gia của chúng tôi kết hợp kỹ thuật tinh xảo với tầm nhìn nghệ thuật độc đáo. Từ sản phẩm thương mại đến phim ngắn nghệ thuật, chúng tôi mang hơi thở mới vào từng khung hình.
                </p>
              </motion.div>

              {/* Sứ mệnh */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#e8bb69] tracking-widest">03</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Sứ mệnh</h2>
                </div>
                <div className="h-px w-24 bg-[#e8bb69]" />
                <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                  Từ ý tưởng đến thực hiện, chúng tôi vượt qua giới hạn sáng tạo để cung cấp công việc không chỉ đáp ứng mong đợi—mà vượt xa mong đợi. Chúng tôi không chỉ làm phim, chúng tôi tạo ra di sản hình ảnh cho bạn.
                </p>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Decorative footer line */}
      <div className="h-24 flex items-center justify-center overflow-hidden">
        <div className="text-[10vw] font-black text-white opacity-[0.02] whitespace-nowrap uppercase tracking-[1rem]">
          Excellence • Passion • Precision
        </div>
      </div>
    </div>
  )
}

export default About
