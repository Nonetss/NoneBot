### Create environment from scratch

```bash
conda create -n NoneBot python=3.11
conda activate NoneBot
conda install -c conda-forge
conda env export --from-history > environment.yml
```

### Create environment from file

```bash
conda env create -f environment.yml
```
