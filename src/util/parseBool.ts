const parseBool = (value: string | number | boolean) => {
	if (value === 1 || value === '1' || value === 'true') return true;
	else return false;
};

export default parseBool;
