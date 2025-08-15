export default function Home() {
  const products = [
    {
      title: "TV Samsung 55” 4K",
      price: "899,99 $",
      oldPrice: "1 299,99 $",
      image: "https://images.samsung.com/is/image/samsung/p6pim/ca/ue55au8000uxzc/gallery/ca-uhd-au8000-ue55au8000uxzc-1.jpg"
    },
    {
      title: "Aspirateur Dyson V11",
      price: "599,99 $",
      oldPrice: "799,99 $",
      image: "https://www.dysoncanada.ca/medialibrary/GroupImages/hero-v11.jpg"
    },
    {
      title: "Nintendo Switch OLED",
      price: "399,99 $",
      oldPrice: "449,99 $",
      image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg"
    },
    {
      title: "iPhone 14 128 Go",
      price: "999,99 $",
      oldPrice: "1 299,99 $",
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-max-deep-purple"
    }
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#2E8B57" }}>
        EconoDeal – Les meilleures liquidations
      </h1>
      <p style={{ textAlign: "center" }}>
        Trouvez les meilleures offres en temps réel au Canada et aux États-Unis
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        {products.map((product, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              backgroundColor: "#fff",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
            <h3 style={{ margin: "10px 0" }}>{product.title}</h3>
            <p style={{ color: "green", fontWeight: "bold" }}>{product.price}</p>
            <p style={{ textDecoration: "line-through", color: "gray" }}>
              {product.oldPrice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
