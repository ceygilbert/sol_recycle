import React, {useEffect, useState} from "react";
import styles from "./../../styles/HowTo.module.css";

const HowTo = (props) => {
	const [searchField, setSearchField] = useState("");
	const items = [
		{
			name: "Aerosols",
			description: "Recyclable at home",
			url: "https://www.recyclenow.com/recycle-an-item/aerosols",
			image: "https://images.unsplash.com/photo-1635766054474-ebaba5355bd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
		},
		{
			name: "Crisp packets",
			description: "Recyclable out of home",
			url: "https://www.recyclenow.com/recycle-an-item/crisp-packets",
			image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1969&q=80"
		},
		{
			name: "Newspaper",
			description: "Recyclable at home",
			url: "https://www.recyclenow.com/recycle-an-item/paper",
			image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
		},
		{
			name: "Paper",
			description: "Recyclable at home",
			url: "https://www.recyclenow.com/recycle-an-item/paper",
			image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
		},
		{
			name: "Foil",
			description: "Recyclable at home",
			url: "https://www.recyclenow.com/recycle-an-item/foil",
			image: "https://images.unsplash.com/photo-1594255897691-9d1edad1ecfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80"
		},
		{
			name: "Clothing and textiles",
			description: "Recyclable out of home",
			url: "https://www.recyclenow.com/recycle-an-item/clothing-textiles",
			image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
		},
		{
			name: "Light bulbs",
			description: "Recyclable out of home",
			url: "https://www.recyclenow.com/recycle-an-item/light-bulbs",
			image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"
		},
		{
			name: "Electrical items",
			description: "Sometimes recyclable at home",
			url: "https://www.recyclenow.com/recycle-an-item/electrical-items",
			image: "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
		},
		{
			name: "Carpet and rugs",
			description: "Recyclable out of home",
			url: "https://www.recyclenow.com/recycle-an-item/carpet-rugs",
			image: "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
		},
		{
			name: "Furniture",
			description: "Recyclable out of home",
			url: "https://www.recyclenow.com/recycle-an-item/furniture",
			image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
		},
		{
			name: "Beauty and grooming packaging",
			description: "Take-back recycling scheme",
			url: "https://www.recyclenow.com/news-and-campaigns/take-back-schemes-for-beauty-grooming-packaging-difficult-recycle",
			image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80"
		},
		{
			name: "Food waste",
			description: "Recyclable at home",
			url: "https://www.recyclenow.com/how-to-recycle/how-to-recycle-food-waste",
			image: "https://images.unsplash.com/photo-1553787434-45e1d245bfbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1010&q=80"
		},
		{
			name: "Plastic bags and wrapping",
			description: "Recyclable out of home",
			url: "https://www.recyclenow.com/recycle-an-item/plastic-bags-and-wrapping",
			image: "https://images.unsplash.com/photo-1597348989645-46b190ce4918?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
		},
		{
			name: "Compostable plastics",
			description: "Compostable at home",
			url: "https://www.recyclenow.com/recycle-an-item/compostable-plastics",
			image: "https://images.unsplash.com/photo-1640045435497-4c65fb5b26ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
		},
		{
			name: "Black plastic packaging",
			description: "Sometimes recyclable at home",
			url: "https://www.recyclenow.com/recycle-an-item/black-plastic-packaging",
			image: "https://images.unsplash.com/photo-1585511582331-14e7c5f89735?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
		}
	];

	const filteredItems = items.filter(
   	item => {
      return (
        item
        .name
        .toLowerCase()
        .includes(searchField.toLowerCase()) ||
        item
        .description
        .toLowerCase()
        .includes(searchField.toLowerCase())
      );
    }
  );

	const handleChange = e => {
    setSearchField(e.target.value);
  };

	return (
		<div className={styles.howto}>
			<div className={styles.title}>How to recycle</div>
			<div className={styles.input}>
				<img src="search.svg" className={styles.search}/>
				{searchField.length > 0 &&
				<img src="searchclear.svg" onClick={() => setSearchField("")} className={styles.clear}/>
				}
				<input placeholder="Search for an item" value={searchField} onChange={handleChange} />
			</div>
			<div className={styles.results}>
				{filteredItems.length > 0 ? filteredItems.map((item, i) => 
					<a href={item.url} target="_blank" className={styles.result} key={i}>
						<div className={styles.image} style={{backgroundImage:"url("+item.image+")"}}></div>
						<div className={styles.info}>
							<div className={styles.name}>
								{item.name}
							</div>
							<div className={styles.desc}>
								{item.description}
							</div>
						</div>
					</a>
					)
					:
					<a className={styles.noresult} target="_blank" href="https://www.recyclenow.com/recycle-an-item">
						<div className={styles.no}>Couldn't find any items</div>
						<div className={styles.no2}>Click to search for more items on recyclenow.com</div>
					</a>
					}
			</div>
		</div>
	)
}

export default HowTo;