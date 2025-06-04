const calculateOffset = (page,limit)=>{
    const offset = (page - 1) * limit;
    return offset;
}
export default calculateOffset;