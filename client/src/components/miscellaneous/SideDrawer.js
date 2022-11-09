import React from 'react'
import { useState } from 'react'
import { initialState } from '../../reducers/userReducer';
import { Button } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"
import { Tooltip } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const SideDrawer = () => {
    const [ search, setSearch ] = useState("");
    const [ searchResult , setsearchResult] = useState([])
    const [ load, setload ] = useState(initialState)
    const [ loadingChat, setloadingChaat ] = useState()
  return (
    <>
        <Box>
            <Tooltip 
                label="Search Users to chat" hasArrow placement = "bottom-end">
                <Button variant={"ghost"}>
                <i className="fas fa-search"></i>
                </Button>                
            </Tooltip>
        </Box>
    </>
  )
}

export default SideDrawer;