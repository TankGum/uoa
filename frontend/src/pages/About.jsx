function About() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <section className="relative py-20 px-6 bg-gradient-to-br from-orange-600 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 uppercase tracking-tight mb-4">
            Về chúng tôi
          </h1>
          <div className="h-1 w-32 bg-zinc-950 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-zinc-900 font-medium max-w-2xl mx-auto">
            Tạo ra những câu chuyện đầy sáng tạo và tính thử nghiệm bằng hình ảnh.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
                Tầm nhìn
              </h2>
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                Chúng tôi tin vào sức mạnh của việc kể câu chuyện bằng hình ảnh để biến thương hiệu và tạo ra những ấn tượng lâu dài. Mỗi khung hình chúng tôi bắt, mỗi câu chuyện chúng tôi kể, đều được tạo ra với độ chính xác và đam mê.
              </p>
              
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
                Những gì chúng tôi làm
              </h3>
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                Chúng tôi tin vào sức mạnh của việc kể câu chuyện bằng hình ảnh để biến thương hiệu và tạo ra những ấn tượng lâu dài. Mỗi khung hình chúng tôi bắt, mỗi câu chuyện chúng tôi kể, đều được tạo ra với độ chính xác và đam mê.
              </p>
              
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
                Sứ mệnh
              </h3>
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                Từ ý tưởng đến thực hiện, chúng tôi vượt qua giới hạn sáng tạo để cung cấp công việc không chỉ đáp ứng mong đợi—mà vượt xa mong đợi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

