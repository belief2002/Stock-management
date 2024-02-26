"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setalert] = useState("");
  const [querry, setquerry] = useState("");
  const [loading, setloading] = useState(false);
  const [loadingAction, setloadingAction] = useState(false);
  const [dropDown, setdropDown] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      const data = await response.json();
      setProducts(data); // Assuming the response is an array of products directly.
    };

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    // Send the POST request to the /api/product endpoint
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        body: JSON.stringify(productForm),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("Product added successfully:", data);
        setalert("Product added successfully!");
        // Reset the form fields
        setProductForm({});
      } else {
        console.error("Error adding product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
    const response = await fetch("/api/product");
    const data = await response.json();
    setProducts(data);
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    setquerry(e.target.value);
    if (e.target.value.length > 3) {
      // setloading(true);
      const response = await fetch("/api/search?query=" + e.target.value);
      const data = await response.json();
      // console.log(data);
      setdropDown(data);
      // setloading(false);
    } else {
      setdropDown([]);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
     let index = products.findIndex((item) => item.productSlug == slug);
    console.log(index)
    let newProducts = JSON.parse(JSON.stringify(products));
    console.log(newProducts)
    if (action == "plus") {
      newProducts[index].productQuantity=parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].productQuantity=parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts)
    let indexDrop = dropDown.findIndex((item) =>item.productSlug == slug);
    let newDropDown = JSON.parse(JSON.stringify(dropDown));
    if (action == "plus") {
      newDropDown[indexDrop].productQuantity=parseInt(initialQuantity) + 1;
    } else {
      newDropDown[indexDrop].productQuantity=parseInt(initialQuantity) - 1;
    }
    setdropDown(newDropDown)
    // console.log(action, slug);
    setloadingAction(true);

    try {
      console.log(initialQuantity);
      const payload = {
        action: action,
        slug: slug,
        initialQuantity: initialQuantity,
      };
  
      const response = await fetch("/api/action", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });   
  
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }
  setloadingAction(false)
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-green-500 text-center">{alert}</div>
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>
        {/* Add product form */}
        <form className="mb-4">
          <label htmlFor="productName" className="block font-bold mb-2">
            Product Slug:
          </label>
          <input
            type="text"
            id="productName"
            name="productSlug"
            value={productForm?.productSlug || ""}
            onChange={handleChange}
            className="border rounded px-4 py-2 w-full mb-2"
          />
          <label htmlFor="productPrice" className="block font-bold mb-2">
            Product Price:
          </label>
          <input
            type="text"
            id="productPrice"
            value={productForm?.productPrice || ""}
            onChange={handleChange}
            name="productPrice"
            className="border rounded px-4 py-2 w-full mb-2"
          />
          <label htmlFor="productQuantity" className="block font-bold mb-2">
            Product Quantity:
          </label>
          <input
            type="number"
            id="productQuantity"
            value={productForm?.productQuantity || ""}
            onChange={handleChange}
            name="productQuantity"
            className="border rounded px-4 py-2 w-full mb-2"
          />
          <button
            type="submit"
            onClick={addProduct}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Product
          </button>
        </form>

        <h1 className="text-2xl font-bold mb-4">Display Stock</h1>
        {/* Stock display */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products"
            // value={searchQuery}
            // onBlur={() => {
            //   setdropDown([]);
            // }}
            onChange={onDropdownEdit}
            className="border rounded px-4 py-2 w-full"
          />
          {/* {loading && (
            
          )} */}
          <div className="bg-purple-100">
            {dropDown?.map((item) => {
              return (
                <div
                  key={item.productSlug}
                  className="container flex justify-between my-1 px-5 bg-purple-100 "
                >
                  <span className="slug">
                    {item.productSlug}: {item.productQuantity} is available for
                    ₹{item.productPrice}{" "}
                  </span>
                  <div className="flex items-center">
                    <button
                      disabled={loadingAction}
                      className=" bg-blue-300 text-white disabled:bg-blue-100 font-bold py-2 px-4 rounded-l"
                      onClick={() => {
                        buttonAction(
                          "plus",
                          item.productSlug,
                          item.productQuantity
                        );
                      }}
                    >
                      +
                    </button>
                    <span className="text-center w-12">
                      {item.productQuantity}
                    </span>
                    <button
                      disabled={loadingAction}
                      className="bg-blue-300 text-white disabled:bg-blue-100 font-bold py-2 px-4 rounded-r"
                      onClick={() => {
                        buttonAction(
                          "minus",
                          item.productSlug,
                          item.productQuantity
                        );
                      }}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {products.map((item) => {
          return (
            <div className="bg-gray-100 p-4 mb-4" key={item.productSlug}>
              <h2 className="text-lg font-bold mb-2">{item.productSlug}</h2>
              <p className="mb-1">₹{item.productPrice}</p>
              <p className="mb-1">{item.productQuantity}</p>
            </div>
          );
        })}
        {/* <div className="bg-gray-100 p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Product 1</h2>
          <p className="mb-1">Price: $10</p>
          <p className="mb-1">Stock: 20</p>
        </div>

        <div className="bg-gray-100 p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Product 2</h2>
          <p className="mb-1">Price: $15</p>
          <p className="mb-1">Stock: 15</p>
        </div> */}
      </div>
    </>
  );
}
