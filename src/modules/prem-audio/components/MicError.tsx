const MicError = ({ error }: { error: string }) => {
  if (error === "permission_denied") {
    return <p className="text-white">Mic Permisison denied</p>;
  }

  if (error) {
    return <p className="text-white">Can not record audio</p>;
  }

  return null;
};

export default MicError;
