const projectsFooterValidation = (page , limit)=>{
    if (page < 1 || limit < 1 || limit > 100) {
      return false;
    }
    return true;
}
export default projectsFooterValidation;