  const products = [
    {
      id: '1',
      name: "Samsung Galaxy S25",
      price: 250000,
      cashPrice: 250000,
      category: "Téléphones",
      image: "https://public.youware.com/users-website-assets/prod/1343b7e5-38d7-4f62-8036-75eaaf41651e/fee30fedf3b7454fab4213166e1ca08c",
      description: "Dernier modèle Samsung avec un écran 6.8 pouces, 12Go RAM, 256Go stockage",
      stock: 15,
      featured: true
    },
    {
      id: '2',
      name: "Samsung Galaxy Z Fold 6",
      price: 550000,
      cashPrice: 550000,
      category: "Téléphones",
      image: "https://public.youware.com/users-website-assets/prod/1343b7e5-38d7-4f62-8036-75eaaf41651e/54fa8ae94d00499ba3f0ad2d6961546d.jpg",
      description: "Téléphone pliable premium avec écran 7.6 pouces quand déplié, 12Go RAM, 512Go stockage",
      stock: 8,
      featured: true
    },
    {
      id: '3',
      name: "Samsung TV Crystal UHD 4K 55\"",
      price: 400000,
      cashPrice: 400000,
      category: "Téléviseurs",
      image: "https://public.youware.com/users-website-assets/prod/1343b7e5-38d7-4f62-8036-75eaaf41651e/d4428486ec1f4482aab1d691ce29e794.jpg",
      description: "Téléviseur 4K UHD avec des couleurs éclatantes et son surround",
      stock: 12,
      featured: true
    },
    {
      id: '4',
      name: "Réfrigérateur Samsung No Frost",
      price: 350000,
      cashPrice: 350000,
      category: "Électroménager",
      image: "https://public.youware.com/users-website-assets/prod/1343b7e5-38d7-4f62-8036-75eaaf41651e/442dad79670449d49d2db375f53350a6.jpg",
      description: "Réfrigérateur combiné avec congélateur, technologie No Frost, 340L",
      stock: 6,
      featured: false
    },
    {
      id: '5',
      name: "iPhone 15 Pro",
      price: 650000,
      cashPrice: 650000,
      category: "Téléphones",
      image: "https://public.youware.com/users-website-assets/prod/1343b7e5-38d7-4f62-8036-75eaaf41651e/fee30fedf3b7454fab4213166e1ca08c",
      description: "iPhone 15 Pro avec puce A17 Pro, appareil photo 48MP et écran ProMotion",
      stock: 10,
      featured: true
    }
  ]

  const cartItems = []
  const userPayments = []
  const currentUser = {
    id: '1',
    name: "Mamadou Diop",
    email: "mamadou.diop@example.com",
    phone: "+221 77 123 45 67"
  }

  const categories = [
    { name: "Tous", value: "" },
    { name: "Téléphones", value: "Téléphones" },
    { name: "Téléviseurs", value: "Téléviseurs" },
    { name: "Électroménager", value: "Électroménager" },
    { name: "Ordinateurs", value: "Ordinateurs" }
  ]