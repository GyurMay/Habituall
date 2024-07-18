import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import habitService from "../services/habitService";
import { Link } from "react-router-dom";

const { useAuth } = require("../context/AuthContext")

const SearchBar = props => {

   const [searchVal, setSearchVal] = useState('');
   const [searchValue] = useDebounce(searchVal, 300);
   const [results, setResults] = useState([]);

   useEffect(() => {
   //  console.log(searchVal);
      if(searchValue.replaceAll(' ', '') === ''){
         setResults([]);
         return;
      }
      console.log(searchValue, "searchValue");
      (async() => {
         const resp = await habitService.search(searchValue);
         // if(resp.ok) console.log(resp.username);
         if(!resp.ok) return;
         const respJson = await resp.json();
         console.log(respJson, "search result");
         setResults(respJson);
      })();
      return () => {
         
      }
   }, [searchValue]);

   const handleChange = (e) => {
    setSearchVal(e.target.value);
   }

   return (
  <> 
<div id="searchbox" className="">
      <input id="searchInput" type="text" value={searchVal} placeholder="Search name or username" onChange={handleChange} className="text-center border border-dark w-1/2 "/>
</div>
<div className="searchResultsContainer w-1/2">
   { //search results
         (results.map(uname => 
            (
            <div className="flex justify-content-center my-1">
               <Link className={"searchResult relative rounded text-center text-white py-3"} to={'/users/'+ uname.username}> @{uname.username}</Link>
            </div>
            )
         ))
   }
</div>
</>
   )
};

const Search = (props) => {
   let auth = useAuth()
   if(!auth.isAuthenticated) return <></>


   return <SearchBar />
}

export {Search}