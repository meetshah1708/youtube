import { Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function SearchBar() {
    const [ searchTerm, setSearchTerm ] = useState('')
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchTerm) {
            navigate(`/search/${searchTerm}`)
            setSearchTerm('')
        }
     }
  return (
      <div>
          <Paper 
              component="form"
              onSubmit={ handleSubmit}
              sx={{
                  borderRadius: 20,
                  border: " 1px solid black",
                 pl:2,
                  background: '#fff',
                  mr: { sm: 5 },
                  justifyContent: 'center',
                  alignItems:'center'
          }}
          >
              <input type="text" onChange={(e)=>{setSearchTerm(e.target.value)}}
                 
                  style={{
                      background: '#fff',
                      border: '0 solid #fff' ,
                      objectFit: 'contain',
                      borderRadius: 20,
                      color: 'black',
                      outline:'none'
                      }}
                  placeholder="Search..."
              />
              
              <i  onClick={handleSubmit} className="fa fa-search" aria-hidden="true" style={{paddingRight:10}} ></i>
              
          </Paper>
    </div>
  )
}
