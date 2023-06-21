## Inter-Instance Similarity Modeling for Contrastive Learning

### 1. Introduction

This is the official implementation of paper: "Inter-Instance Similarity Modeling for Contrastive Learning".

![Framework](./images/framework.png)

PatchMix is a novel image mix strategy, which mixes multiple images in patch level. The mixed image contains massive local components from multiple images and efficiently simulates rich similarities among natural images in an unsupervised manner. To model rich inter-instance similarities among images, the contrasts between mixed images and original ones, mixed images to mixed ones, and original images to original ones are conducted to optimize the ViT model. Experimental results demonstrate that our proposed method significantly outperforms the previous state-of-the-art on both ImageNet-1K and CIFAR datasets, e.g., 3.0% linear accuracy improvement on ImageNet-1K and 8.7% kNN accuracy improvement on CIFAR100.

[[Paper]()]    [[BibTex](#Citation)]

### 2. Requirements

```bash
conda create -n patchmix python=3.8
pip install -r requirements.txt
```



### 3. Datasets

 `CIFAR10`, `CIFAR100` datasets provided by `torchvision`. The root paths of data are set to `/path/to/dataset` . The root path of  `ImageNet-1K (ILSVRC2012)` is `/path/to/ILSVRC2012`



### 4. Self-Supervised Pretraining

#### ViT-Small with 2-node (8-GPU) training

Set hyperparameters, dataset and GPU IDs in `./config/pretrain/vit_small_pretrain.py` and run the following command

```bash
python main_pretrain.py --arch vit-small
```



### 5. kNN Evaluation

Set hyperparameters, dataset and GPU IDs in `./config/knn/knn.py` and run the following command

```bash
python main_knn.py --arch vit-small --pretrained-weights /path/to/pretrained-weights.pth
```



### 6. Linear Evaluation

Set hyperparameters, dataset and GPU IDs in `./config/linear/vit_small_linear.py` and run the following command:

```bash
python main_linear.py --arch vit-small --pretrained-weights /path/to/pretrained-weights.pth
```



### 7.  Fine-tuning Evaluation

Set hyperparameters, dataset and GPUs in `./config/finetuning/vit_small_finetuning.py` and run the following command

```bash
python python main_finetune.py --arch vit-small --pretrained-weights /path/to/pretrained-weights.pth
```



### 8. Main Results and Model Weights

#### 8.1 ImageNet-1K

|     Arch     | Batch size | #Pre-Epoch | Finetuning | Linear | kNN | Weights                                                    |
|:------------:|:------:|:-----:|:------:|:--------:|:----------------------------------------------------------------------:|:----------------------------------------------------------------------:|
|   ViT-S/16   |  1024  |  300  | 82.8% |  77.4%  |   73.3%   | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/imagenet1k) |
|   ViT-B/16   |  1024  |  300  | 84.1% |  80.2%  |   76.5%   | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/imagenet1k) |



#### 8.2 CIFAR10

|  Arch   | Batch size | #Pre-Epoch | Finetuning | Linear |  kNN  |                           Weights                            |
| :-----: | :--------: | :--------: | :--------: | :----: | :---: | :----------------------------------------------------------: |
| ViT-T/2 |    512     |    800     |   97.5%    | 94.4%  | 92.9% | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/cifar10/vit-tiny-800-92.94/last.pth) |
| ViT-S/2 |    512     |    800     |   98.1%    | 96.0%  | 94.6% | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/cifar10/vit-small-800-94.64/last.pth) |
| ViT-B/2 |    512     |    800     |   98.3%    | 96.6%  | 95.8% | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/cifar10/vit-base-800-95.81/last.pth) |



#### 8.3 CIFAR100

|  Arch   | Batch size | #Pre-Epoch | Finetuning | Linear |  kNN  |                           Weights                            |
| :-----: | :--------: | :--------: | :--------: | :----: | :---: | :----------------------------------------------------------: |
| ViT-T/2 |    512     |    800     |   84.9%    | 74.7%  | 68.8% | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/cifar100/vit-tiny-800-68.75/last.pth) |
| ViT-S/2 |    512     |    800     |   86.0%    | 78.7%  | 75.4% | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/cifar100/vit-small-800-72.76/last.pth) |
| ViT-B/2 |    512     |    800     |   86.0%    | 79.7%  | 75.7% | [link](/disk2/home/liudw/backup/PatchMix/ckpt/pretrain/cifar100/vit-base-800-73.43/last.pth) |



### 9. The Visualization of Inter-Instance Similarities

![visualization](./images/visualization.png)

The query sample and the image with id 4 in key samples are from the same category. The images with id 3 and 5 come from category similar to query sample.

### 10. License

This project is under the CC-BY-NC 4.0 license. See [LICENSE](LICENSE) for details.

### 11. Citation

```bibtex
@article{shen2023inter,
  author  = {Shen, Chengchao and Liu, Dawei and Tang, Hao and Qu, Zhe and Wang, Jianxin},
  title   = {Inter-Instance Similarity Modeling for Contrastive Learning},
  journal = {},
  year    = {2023},
}
```

