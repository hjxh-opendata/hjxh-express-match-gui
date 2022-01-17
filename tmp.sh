git filter-branch --prune-empty -d ~/temp --index-filter "git rm --cached -rf --ignore-unmatch samples"  --tag-name-filter cat -- --all
