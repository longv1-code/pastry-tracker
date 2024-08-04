'use client'
import Image from "next/image"
import { useState, useEffect} from 'react'
import { firestore } from "./firebase"
import { Box, Typography, Stack, TextField, Button } from "@mui/material"
import { collection, deleteDoc, doc, getDoc, query, setDoc, getDocs } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [searchItem, setSearchItem] = useState([''])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity == 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleSearch = (search) => {
    if (!search) return updateInventory()

    const resultsArray = inventory.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    setInventory(resultsArray)
  }
  const enterKeyDown = (e) => {
    if (e.key === "Enter" & searchItem != '') {
      console.log('Enter is pressed.')
      addItem(searchItem)
      setSearchItem('')
    }
  }
  return (
    <Box 
    width="100vw" 
    height="100vh" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center"
    gap={2}
    >  
      <Stack>
        <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        fontWeight={700}
        fontSize={60}
        margin={5}
        letterSpacing={2}
        color="#272343"
        >
          Pantry Tracker
        </Box>
        <TextField sx={{width: "70vw", background: "#fffffe"}} id="outlined-basic" label="Search" variant="outlined" onKeyDown={enterKeyDown} value={searchItem} onChange={(e) => {
          setSearchItem(e.target.value)
          handleSearch(e.target.value)
        }
          } />
          <Button id="button" sx={{width: "30vw", margin: "0 auto", color: "#fffffe"}} variant="contained" onClick={()=>{
            console.log('Button Pressed')
            if (searchItem != '') {
              addItem(searchItem)
              setSearchItem('')
            }
          }}>
          Add New Item
        </Button>
      </Stack>
      <Box border="1px solid #333">
        <Box 
        width="800px" 
        height="100px" 
        bgcolor="#272343" 
        display="flex"
        alignItems="center" 
        
        >
          <Typography margin="0 50px 0 20px" variant="h4" color="#fffffe">
            Quantity
          </Typography>
          <Typography margin="0 50px 0 100px"variant="h4" color="#fffffe">
            Item
          </Typography>
          <Typography margin="0 50px 0 195px" variant="h4" color="#fffffe">
            Action
          </Typography>
        </Box>
      
      <Stack width="800px" height="370px" spacing={2} overflow="auto" bgcolor="#fffffe">
        {inventory.map(({name, quantity})=>(
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#fffffe"
              padding={5}
            >
              <Typography 
              fontSize={40}
              color="#2d334a" 
              textAlign="center"
              marginLeft="20px"
              >
                {quantity}
              </Typography>
              
              <Typography 
              fontSize={40}
              color="#2d334a" 
              textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Button id="button" variant="contained" onClick={()=>{
                  addItem(name)
                }}
                >
                  Add
                </Button>
                <Button id="button" variant="contained" onClick={()=>{
                  removeItem(name)
                }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
  )
}
