const ProjectsLengthValidator = (result) =>{
    if (result.data.length > 0)
    {
        return true;
    }
    return false;
}
export default ProjectsLengthValidator;